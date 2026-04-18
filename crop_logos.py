from PIL import Image, ImageChops
import os

files = ['Brand1.jpeg', 'Brand2.jpeg', 'Brand3.jpeg', 'Brand4.jpeg']
for f in files:
    if os.path.exists(f):
        try:
            img = Image.open(f).convert("RGB")
            # Create a background image based on the top-left pixel
            bg_color = img.getpixel((0,0))
            bg = Image.new(img.mode, img.size, bg_color)
            diff = ImageChops.difference(img, bg)
            # Threshold to get more of the logo
            diff = ImageChops.add(diff, diff, 2.0, -50)
            bbox = diff.getbbox()
            if bbox:
                # Add some padding
                pad = 10
                bbox = (
                    max(0, bbox[0] - pad),
                    max(0, bbox[1] - pad),
                    min(img.size[0], bbox[2] + pad),
                    min(img.size[1], bbox[3] + pad)
                )
                cropped = img.crop(bbox)
                out_name = f"cropped_{f}"
                cropped.save(out_name)
                print(f"Processed {f} -> {out_name} (bbox: {bbox})")
            else:
                print(f"Could not find bounding box (solid image?) for {f}")
        except Exception as e:
            print(f"Error processing {f}: {e}")
    else:
        print(f"File not found: {f}")
