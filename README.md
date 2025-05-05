I often need something that can join several images into a single vertical strip so I quickly put together this cli utility tool. 
This tool does exactly what I want it to do and nothing more.

```
# Replace img1.jpeg and img2.jpeg with the name of the image.
# Can take any number of images, not just two.

deno run stitch img1.jpeg img2.jpeg
```

Made using Deno and Jimp
https://docs.deno.com/
https://www.npmjs.com/package/jimp
