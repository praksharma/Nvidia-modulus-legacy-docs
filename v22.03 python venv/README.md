##  NVIDIA Modulus v22.03 Python venv
This file contains the instructions to use NVIDA Modulus v22.03 pre-installed in a Python venv.

I've uploaded the Python venv [here](https://drive.google.com/drive/folders/1OkBamVKShWsNJyB8_WU84OYOwfDos2yz?usp=sharing). The file is private and ask me if you need access to the file.

There are three files.

* modulus_pysdf.tar.gz
* python3.8
* libsdf.so

The first is the entire venv and the seconds files is the symlink to the `python3`. The `libsdf.so` is a C++ library to implement tessellated geometry only applicable to RTX GPU. All you need to do is extract the `tar.gz` file and replace `bin/python3` with `python3.8`.

Extract the `tar.gz` without the output, otherwise the `STDOUT` will slow down the extraction.

```sh
tar -xf modulus_pysdf.tar.gz -C modulus_pysdf >/dev/null 2>&1
```

Alternatively, you can use a GUI to extract the files.

Now, rename `python3.8` to `python3` and paste it inside `bin` directory.

If you need to use the PySDF tessellation, export the location of the `libsdf.so` file. This is completely optional.

```sh
export LD_LIBRARY_PATH=$(pwd)/:${LD_LIBRARY_PATH}
```

Now activate the environment and enjoy fully-working NVIDIA Modulus v22.03.

```sh
source modulus_pysdf/bin/activate
```