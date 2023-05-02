# Nvidia Modulus Legacy Docs

Date : 2nd May 2023, Tuesday

As NVIDIA Modulus is transitioning from a [restrictive license](LICENSE.pdf) to Apache License 2.0, I am afraid that they'll ditch the legacy documentation. So, I used the good old `wget` to grab the entire documentation website.

## Available versions
### Modulus v21.06
I've put the docs of Modulus v21.06 and v22.09. The Modulus v21.06 was very similar to NVIDIA Simnet as both were written in Tensorflow 1.x. The docs were included within a PDF file, which you can find in the "v21.06 docs" directory.

I think NVIDIA devs also [hated](https://www.reddit.com/r/MachineLearning/comments/m3boyo/d_why_is_tensorflow_so_hated_on_and_pytorch_is/) Tensorflow 1.x and its symbolic graph requiring crappy dictionaries. Thus, Modulus v22.03 was rewritten in PyTorch. The PDF documentation was also replaced with [online documentation](https://docs.nvidia.com/deeplearning/modulus/index.html). Modulus v22.07 and v22.09 added more architectures and examples on top of v22.03. The online docs remained almost the same with minor import statement changes in the example. For example, the geometries were moved from "csg2d" and to "csg3d" to "primitives", I don't remember the exact directory names.

### Modulus 22.09
You can find the v22.09 docs in the "v22.09 docs" directory. Unfortunately, NVIDIA doesn't use relative hyperlinks so clicking the link will open the official docs which may or may not work in future. Instead, clone this repo and open indvidual html files in "v22.09 docs/modulus/modulus-v2209". The module docs can be found in the "v22.09 docs/modulus/modulus-v2209/_modules" directory whereas the examples can be found in "v22.09 docs/modulus/modulus-v2209/user_guide".

If you want to navigate through the docs with the hyperlinks you'll need to manually modify the hardcoded hyperlink. Now you know why I said just open individual html files. 

## Grab a website
Here is a simplified command to grab a website.

```sh
wget -r -p -U Mozilla https://docs.nvidia.com/deeplearning/modulus/modulus-v2209/index.html
```

The command employs a Mozilla user agent as many websites don't allow directly grabbing websites and sucking the bandwidth. Some websites may reject a connection as you exceed a predefined bandwidth, so you need to act more like a real web browser with delays between each request. Here is a minimal to add delays and limit the bandwidth, so you don't overwhelm the web server with too many requests.

```sh
wget -r -p -U Mozilla --wait=10 --limit-rate=35K https://docs.nvidia.com/deeplearning/modulus/modulus-v2209/index.html
```

The `--wait` is in seconds. [Here](https://www.makeuseof.com/tag/how-do-i-download-an-entire-website-for-offline-reading/) is a blog talking about the GUI alternatives.

## LICENSE
These docs were released under some [fancy license](LICENSE.pdf). So, yeah I am not the owner of these docs and you may not redistribute them unless you wanted to be sued by the NVIDIA.