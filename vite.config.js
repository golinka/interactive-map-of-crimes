import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export default () => {
  return {
    plugins: [
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
        symbolId: "[name]",
      }),
    ],
  };
};
