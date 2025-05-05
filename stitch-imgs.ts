// https://jimp-dev.github.io/jimp/api
import { Jimp } from "npm:jimp";

if (import.meta.main) {
  console.log("STARTING");

  const imagePaths = [...Deno.args];
  if (imagePaths.length <= 0)
    throw new Error(
      "You need to pass the paths to images while running the command",
    );

  console.log("READING IMAGES");
  const images = await Promise.all(
    imagePaths.map(async (path) => {
      const res = await Jimp.read(path);
      return res;
    }),
  );

  const heights = images.map((img) => img.height);
  const widths = images.map((img) => img.width);

  const sumHeight = heights.reduce((p, c) => p + c);
  const _sumWidth = widths.reduce((p, c) => p + c);

  console.log("CREATING BACKGROUND");
  const background = new Jimp({
    height: sumHeight,
    width: Math.max(...widths),
  });

  console.log("STITCHING IMAGES");
  // position of placement current image (in unit px)
  let position = 0;
  images.forEach((img) => {
    background.composite(img, 0, position);
    position += img.height;
  });

  await background.write("strip.jpeg");

  console.log("DONE");
}
