for file in *.HEIC; do
  # Convert HEIC to PNG
  sips -s format png "$file" --out "${file%.*}.png"

  # Get the image width
  width=$(sips -g pixelWidth "${file%.*}.png" | tail -n1 | cut -d" " -f4)

  # If the image width is greater than 600px, resize it
  if [ "$width" -gt 600 ]; then
    sips -Z 600 "${file%.*}.png"
  fi
done
