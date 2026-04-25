#!/usr/bin/env python3
from PIL import Image
import os
from pathlib import Path

image_dir = r"c:\Users\eniph\ATRIoT_products\assets\images"
backup_dir = os.path.join(image_dir, "original-backup")

# Create backup directory
os.makedirs(backup_dir, exist_ok=True)
print(f"Backup directory: {backup_dir}")

total_before = 0
total_after = 0
images_compressed = 0

for filename in os.listdir(image_dir):
    if filename in ["original-backup", "compress-images.ps1"]:
        continue
    
    filepath = os.path.join(image_dir, filename)
    
    if not os.path.isfile(filepath):
        continue
    
    if not filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        continue
    
    try:
        # Get original size
        original_size = os.path.getsize(filepath)
        total_before += original_size
        
        # Backup original
        backup_path = os.path.join(backup_dir, filename)
        if not os.path.exists(backup_path):
            with open(filepath, 'rb') as f_in:
                with open(backup_path, 'wb') as f_out:
                    f_out.write(f_in.read())
        
        # Open and resize image if too large
        with Image.open(filepath) as img:
            # Convert RGBA to RGB if needed (for JPG)
            if img.mode == 'RGBA' and filename.lower().endswith('.jpg'):
                rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                rgb_img.paste(img, mask=img.split()[3])
                img = rgb_img
            
            # Resize if dimensions exceed 2048
            max_dim = 2048
            if img.width > max_dim or img.height > max_dim:
                img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            
            # Save with quality reduction
            quality = 85
            if filename.lower().endswith('.png'):
                img.save(filepath, 'PNG', optimize=True)
            else:
                img.save(filepath, 'JPEG', quality=quality, optimize=True)
        
        # Get new size
        new_size = os.path.getsize(filepath)
        total_after += new_size
        reduction_pct = round(((original_size - new_size) / original_size) * 100, 1)
        
        original_mb = round(original_size / (1024 * 1024), 2)
        new_mb = round(new_size / (1024 * 1024), 2)
        
        print(f"OK: {filename}: {original_mb} MB to {new_mb} MB (-{reduction_pct}%)")
        images_compressed += 1
    
    except Exception as e:
        print(f"ERROR: {filename}: {e}")

# Final summary
if total_before > 0:
    total_reduction = round(((total_before - total_after) / total_before) * 100, 1)
    before_mb = round(total_before / (1024 * 1024), 2)
    after_mb = round(total_after / (1024 * 1024), 2)
    saved_mb = round((total_before - total_after) / (1024 * 1024), 2)
    
    print("")
    print("========================================")
    print(f"Total: {before_mb} MB to {after_mb} MB (-{total_reduction}%)")
    print(f"Saved: {saved_mb} MB")
    print(f"Images compressed: {images_compressed}")
    print(f"Originals backed up to: {backup_dir}")
else:
    print("No images found or processed.")
