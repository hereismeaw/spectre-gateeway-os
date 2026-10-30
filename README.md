# SpectreOS

SpectreOS is a gateway operating system for LoRaWAN and Wi-Fi HaLow.
It is built on OpenWrt and ChirpStack Gateway OS, then shaped for boards
we actually flash: a Raspberry Pi 4 class concentrator, a Raspberry Pi 5,
and a Hardkernel Odroid-C4.

The web interface is LuCI. The network server pieces keep their ChirpStack
names. The product on the banner is SpectreOS 1.0.0.

## What you get

- LoRaWAN region defaults to AS923, the plan used in Thailand. The 2.4 GHz
  radio stays on ISM2400.
- The clock is Asia/Bangkok, UTC+7.
- A setup access point named `SpectreOS-<mac>` with passphrase `spectre168`
  on `192.168.168.1`. Wired LAN stays a DHCP client, so the access point
  does not collide with the router.
- English menus, a dark olive theme, and a SpectreOS radios page that
  selects the concentrator or the HaLow card.
- ChirpStack concentrator, MQTT forwarder, and the gateway web UI.

## Boards

| Profile | Hardware | Image target |
| --- | --- | --- |
| `spectre_rpi4_bcm2711` | SenseCAP M1 and other Pi 4 / BCM2711 gateways, plus RAK7391 | `bcm27xx/bcm2711` |
| `spectre_rpi5_bcm2712` | Raspberry Pi 5 | `bcm27xx/bcm2712` |
| `spectre_odroid_c4` | Odroid-C4, Amlogic S905X3 | `meson/sm1` |

SenseCAP M1 has one mini-PCIe socket. Swap the LoRa concentrator and the
Wio-WM6108; they do not share that socket. An AHPI7292S on the 40-pin
header needs the switch set to Host before power-on, and it cannot share
SPI0 with an SPI concentrator. USB LoRa can stay beside it.

The Raspberry Pi 5 profile uses the 40-pin header. The Odroid-C4 profile
uses a USB concentrator. The HaLow SPI overlay is built for the Pi header
pinout. It has been applied and removed on a SenseCAP M1 while LoRa still
owned the bus. The card itself has not been probed on Pi 5 or Odroid-C4.

## Build

Docker is required. From this tree:

```bash
make init
make devshell
```

Inside the devshell, pick one profile and build it. One `make` produces
one image.

```bash
make switch-env ENV=spectre_odroid_c4
cd openwrt
make defconfig
make target/linux/refresh
make -j"$(nproc)"
```

Use `spectre_rpi5_bcm2712` or `spectre_rpi4_bcm2711` the same way.
The first Odroid-C4 build needs `make target/linux/refresh` so the kernel
configuration is rewritten for the Meson target. Later builds of that
same tree can skip it.

Images are written under `openwrt/bin/targets/`.

| Profile | Directory |
| --- | --- |
| Odroid-C4 | `openwrt/bin/targets/meson/sm1/` |
| Raspberry Pi 5 | `openwrt/bin/targets/bcm27xx/bcm2712/` |
| Raspberry Pi 4 / SenseCAP M1 | `openwrt/bin/targets/bcm27xx/bcm2711/` |

Write the `.img.gz` to a microSD card. On the Odroid-C4 the signed
bootloader sits in the first 4 MiB of that image. Do not run
`make update` unless you intend to replace the pinned feeds. That refresh
drops the local HaLow fixes that are not on the upstream pins yet.

## Upstream

SpectreOS tracks ChirpStack Gateway OS, OpenWrt 24.10, and the ChirpStack
OpenWrt feed. Those histories stay on the `upstream` remotes. SpectreOS
commits live on the `spectreos` branch.

## License

Inherited from OpenWrt and ChirpStack Gateway OS. See `COPYING` and the
license headers in each package.

Made in Phatthalung, Thailand
