# Making new profile picture

Once cropped, can do

```
convert -strip -interlace Plane -gaussian-blur 0.05 -quality 85% -define jpeg:dct-method=float profile.jpg resized.jpg
convert profile.jpg -resize 160x160\> resized.jpg
```

To get the resized version that's compressed and small/web-ready.
