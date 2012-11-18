#codejam2012

## Virtual Machine
### Ubuntu Server 12.10 x86

#### Usage
Working Directory: `/home/ubuntu/codejam2012`
- Start Client & GUI deamon processes via `./start`
- Stop deamon processes via `./stop`
- Process stout log files: `client.log` & `client_gui.log`
- Other usages to monitor processes: `forever -h`

####Login, SSH, sudo
- Username: *ubuntu*
- Password: *reverse*

#### Disclaimer
Keyboard layout is set to *mac-usb-us*.
If keyboard layout is incorrect for you:
- SSH to `ubuntu@xxx.xxx.xxx.xxx`, LAN address found via `ifconfig`
- or, `sudo dpkg-reconfigure keyboard-configuration` to change keyboard layout

