# Nvidia Modulus Legacy Docs

The docs are available on WayBack Machine.

https://web.archive.org/web/20230327210058/https://docs.nvidia.com/deeplearning/modulus/user_guide/notebook/notebook.html

Date : 2nd May 2023, Tuesday

As NVIDIA Modulus is transitioning from a [restrictive license](LICENSE.pdf) to Apache License 2.0, I am afraid that they'll ditch the legacy documentation. So, I used the good old `wget` to grab the entire documentation website.

This repo also contains the NVIDIA Modulus Python venv. You can read [this file](v22.03%20python%20venv/README.md) for further instructions.

## What are HTML files?
If have no idea what the heck is HTML files then continue to read this section. These files are used by the web browser to render websites. Here is an example of a html page : https://docs.nvidia.com/modulus/index.html

## Easily open HTML files from Github
You don't need to clone the repo to view the HTML files. Our homies have created a HTML preview tool that allows you to render HTML files directly from the Github. Simply, go [here](https://htmlpreview.github.io/) and paste link to any HTML file. For example, here is the [index.html](https://htmlpreview.github.io/?https://github.com/praksharma/Nvidia-modulus-legacy-docs/blob/main/v22.09%20docs/modulus/modulus-v2209/index.html). Now you can navigate through the entire documentation using the hyperlink. Unfortunately, the tool is not perfect and the sidebar may not work. But the hyperlink within the main area still works.

## Available versions
### Modulus v21.06
I've put the docs of Modulus v21.06 and v22.09. The Modulus v21.06 was very similar to NVIDIA Simnet as both were written in Tensorflow 1.x. The docs were included within a PDF file, which you can find in the "v21.06 docs" directory.

I think NVIDIA devs also [hated](https://www.reddit.com/r/MachineLearning/comments/m3boyo/d_why_is_tensorflow_so_hated_on_and_pytorch_is/) Tensorflow 1.x and its symbolic graph requiring crappy dictionaries. Thus, Modulus v22.03 was rewritten in PyTorch. The PDF documentation was also replaced with [online documentation](https://docs.nvidia.com/deeplearning/modulus/index.html). Modulus v22.07 and v22.09 added more architectures and examples on top of v22.03. The online docs remained almost the same with minor import statement changes in the example. For example, the geometries were moved from "csg2d" and to "csg3d" to "primitives", I don't remember the exact directory names.

### Modulus 22.09
You can find the v22.09 docs in the "v22.09 docs" directory. Unfortunately, NVIDIA doesn't use relative hyperlinks so clicking the link will open the official docs which may or may not work in future. Instead, clone this repo or use the Github preview tool mentioned earlier. Then open the indvidual html files in "v22.09 docs/modulus/modulus-v2209". The module docs can be found in the "v22.09 docs/modulus/modulus-v2209/_modules" directory whereas the examples can be found in "v22.09 docs/modulus/modulus-v2209/user_guide".

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

## NVIDIA Modulus deleted docs
Date: 22 June 2023

Wonderful. It looks like NVIDIA has already deleted [some parts](https://docs.nvidia.com/deeplearning/modulus/api/modulus.deploy.html) of the docs. Especially, the instructions to run their example in a Jupyter notebook. Unfortunately, it isn't available on the WayBack Machine either.

NGL after a heated argument with ChatGPT I finally managed to recreate relevant codes. [Here](jupyter_notebook.ipynb), You can find the jupyter notebook.

Date:  22 June 2023

That one is also not working. I finally found the docs on WayBackMachine. The webpage is saved here: `v22.09 docs/Jupyter Notebook workflow - NVIDIA Docs.html`.

## LICENSE
These docs were released under some [fancy license](LICENSE.pdf). So, yeah I am not the owner of these docs and you may not redistribute them unless you wanted to be sued by the NVIDIA.
