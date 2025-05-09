// https://jimp-dev.github.io/jimp/api
import { Jimp } from "npm:jimp";
import * as path from "jsr:@std/path";

if (import.meta.main) {
  console.log("STARTING");
  const imagePaths = [];
  const args = [...Deno.args];

  const i = args.indexOf("--folder");
  const path2folder = args?.at(i + 1);

  if (i > -1 && path2folder) {
    for await (const file of Deno.readDir(path2folder)) {
      const filePath = `${path2folder}/${file.name}`;
      const ext = path.extname(filePath).search(/jpeg|jpg|png|webp/);
      ext === 1 && imagePaths.push(filePath);
    }
  } else if (imagePaths.length <= 0)
    throw new Error(
      "You need to pass the paths to images while running the command",
    );
  else {
    imagePaths.push(...args);
  }

  console.log("READING IMAGES", imagePaths);
  const images = await Promise.all(
    imagePaths.map(async (path) => await Jimp.read(path)),
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
