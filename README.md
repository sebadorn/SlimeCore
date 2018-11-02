# SlimeCore

A JavaScript library with functionality for easier game development.

Still in development. Functions and usage may change at any time. There is no proper documentation.


## Requirements

Some functionality is only available with [NW.js](https://nwjs.io/).

The browser has to support ECMAScript 6.

For rendering a third-party library is necessary. At the moment the following are supported:
* [PixiJS](http://www.pixijs.com/)


## DS3/4 Controller Access in NW.js

On Linux you have to set some udev rules first. Add a file `/etc/udev/rules.d/61-dualshock.rules`:

    SUBSYSTEM=="input", GROUP="input", MODE="0666"
    SUBSYSTEM=="usb", ATTRS{idVendor}=="054c", ATTRS{idProduct}=="0268", MODE:="666", GROUP="plugdev"
    KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"
    
    SUBSYSTEM=="input", GROUP="input", MODE="0666"
    SUBSYSTEM=="usb", ATTRS{idVendor}=="054c", ATTRS{idProduct}=="05c4", MODE:="666", GROUP="plugdev"
    KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"
    
    SUBSYSTEM=="input", GROUP="input", MODE="0666"
    SUBSYSTEM=="usb", ATTRS{idVendor}=="054c", ATTRS{idProduct}=="09cc", MODE:="666", GROUP="plugdev"
    KERNEL=="hidraw*", SUBSYSTEM=="hidraw", MODE="0664", GROUP="plugdev"

    sudo udevadm control --reload-rules

Source: https://www.npmjs.com/package/dualshock-controller

Also see my blog post about it: https://sebadorn.de/2017/12/07/using-nw-js-to-communicate-with-a-ds4-controller
