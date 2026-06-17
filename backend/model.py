import os
import tempfile
import zipfile

import torch
import torch.nn as nn
from PIL import Image
import torchvision.transforms as transforms
import numpy as np

# ── ANIMEGANV2 GENERATOR ARCHITECTURE ─────────────────────────────────
# Standard lightweight Conv-Layer block for image stylization
class ConvBlock(nn.Module):
    def __init__(self, in_ch, out_ch, kernel_size=3, stride=1, padding=1):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, kernel_size, stride, padding, bias=False)
        self.norm = nn.InstanceNorm2d(out_ch, affine=True)
        self.relu = nn.LeakyReLU(0.2, inplace=True)

    def forward(self, x):
        return self.relu(self.norm(self.conv(x)))

class Generator(nn.Module):
    def __init__(self):
        super().__init__()
        # Down-sampling blocks
        self.block_a = ConvBlock(3, 32, kernel_size=7, padding=3)
        self.block_b = ConvBlock(32, 64, stride=2)
        self.block_c = ConvBlock(64, 128, stride=2)
        # Residual architecture for processing features
        self.res_block = ConvBlock(128, 128)
        # Up-sampling blocks
        self.block_d = nn.Sequential(
            nn.Upsample(scale_factor=2, mode='bilinear', align_corners=False),
            ConvBlock(128, 64)
        )
        self.block_e = nn.Sequential(
            nn.Upsample(scale_factor=2, mode='bilinear', align_corners=False),
            ConvBlock(64, 32)
        )
        self.to_rgb = nn.Sequential(
            nn.Conv2d(32, 3, kernel_size=7, padding=3),
            nn.Tanh()
        )

    def forward(self, x):
        x = self.block_a(x)
        x = self.block_b(x)
        x = self.block_c(x)
        for _ in range(4): # Process through residual latents
            x = x + self.res_block(x)
        x = self.block_d(x)
        x = self.block_e(x)
        return self.to_rgb(x)


def _find_weights_source():
    """Find a loadable checkpoint file or an extracted torch archive directory."""
    base_dir = os.path.dirname(__file__)
    search_roots = [
        os.path.join(base_dir, "weights"),
        os.path.join(base_dir, "weights.pth"),
    ]

    for root in search_roots:
        if os.path.isfile(root) and root.endswith((".pth", ".pt", ".bin")):
            return root

        if not os.path.isdir(root):
            continue

        for dirpath, _, filenames in os.walk(root):
            for filename in filenames:
                if filename.endswith((".pth", ".pt", ".bin")):
                    return os.path.join(dirpath, filename)

        if os.path.exists(os.path.join(root, "data.pkl")):
            return root

        for entry in os.listdir(root):
            entry_path = os.path.join(root, entry)
            if os.path.isdir(entry_path) and os.path.exists(os.path.join(entry_path, "data.pkl")):
                return entry_path

    return None


def _load_checkpoint(source_path):
    """Load a checkpoint from a file or from an extracted torch zip layout."""
    if os.path.isdir(source_path):
        with tempfile.NamedTemporaryFile(suffix=".pth", delete=False) as temp_file:
            temp_path = temp_file.name

        try:
            with zipfile.ZipFile(temp_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
                for dirpath, _, filenames in os.walk(source_path):
                    for filename in filenames:
                        full_path = os.path.join(dirpath, filename)
                        relative_path = os.path.relpath(full_path, source_path)
                        archive_name = os.path.join(os.path.basename(source_path), relative_path)
                        archive.write(full_path, arcname=archive_name)

            return torch.load(temp_path, map_location="cpu")
        finally:
            try:
                os.remove(temp_path)
            except OSError:
                pass

    return torch.load(source_path, map_location="cpu")

# ── INFERENCE PIPELINE ────────────────────────────────────────────────
def transform_image(input_path, output_path):
    """
    Loads an image from input_path, passes it through the generator weights,
    and saves the stylized manga output to output_path.
    """
    # 1. Image Preprocessing (Resize and convert to a normalized tensor)
    image = Image.open(input_path).convert("RGB")
    
    # Resize to divisible by 4 to prevent convolutional alignment artifacts
    w, h = image.size
    w, h = (w // 4) * 4, (h // 4) * 4
    image = image.resize((w, h), Image.BICUBIC)

    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize(mean=(0.5, 0.5, 0.5), std=(0.5, 0.5, 0.5))
    ])
    img_tensor = transform(image).unsqueeze(0) # Add batch dimension

    # 2. Run Model Inference
    model = Generator()

    weights_path = _find_weights_source()

    if weights_path:
        print(f"--> Successfully loading trained AnimeGAN layers from: {weights_path}")
        checkpoint = _load_checkpoint(weights_path)
        if isinstance(checkpoint, dict):
            if "state_dict" in checkpoint:
                checkpoint = checkpoint["state_dict"]
            elif "generator" in checkpoint:
                checkpoint = checkpoint["generator"]

        if isinstance(checkpoint, dict):
            model.load_state_dict(checkpoint, strict=False)
        else:
            raise TypeError("Checkpoint did not contain a state dict")
    else:
        raise FileNotFoundError("No loadable model checkpoint found in backend/weights or backend/weights.pth")

    model.eval()
    with torch.no_grad():
        output = model(img_tensor)

    # 3. Post-process the output tensor back to a human-readable PIL Image
    output = output.squeeze(0).clip(-1, 1)
    output = (output.numpy().transpose(1, 2, 0) + 1) / 2.0 * 255.0
    output = Image.fromarray(output.astype(np.uint8))
    
    # Save the transformed asset
    output.save(output_path)