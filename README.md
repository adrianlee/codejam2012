#McGill Code Jam 3

###Low-latency Algorithmic Trading Application
![App Screenshot](https://raw.github.com/adrianlee/codejam2012/master/screenshot.png)

**Team Members**<br/>
Adrian Lee


Node.js v0.8.14, D3.js v2, Bootstrap v2, Redis v2.6.4

## Problem
You have been selected by Morgan Stanley’s Electronic Trading group (MSET) to provide a platform for 
testing out new low-latency trading strategies on electronic exchanges. Trading strategies are a 
predefined set of rules for making trading decisions. Certain strategies are better suited to be executed 
algorithmically, via a computer, to take advantage of faster processing time. On a given exchange, there 
are many trading strategies being executed, and often the speed in which an algorithm reacts to a given 
market condition can greatly influence its profitability. MSET would like to benchmark several strategies
in order to find the best one.

Your task is to build an application that will handle trading, scheduling, and reporting for MSET. Your 
application will connect to an exchange’s price feed, process incoming prices and make trades according 
to the several strategies. The application will also display real-time graphs for the price feed, as well as 
the indicators of the various strategies. Finally, the trade history must be tracked, and supervised by 
trade managers that your application will schedule.

[Proposal Document](https://github.com/adrianlee/codejam2012/blob/master/Code%20Jam%20Proposal.pdf?raw=true)

## Virtual Machine
### Ubuntu Server 12.10 x86

#### Usage
Working Directory is */home/ubuntu/codejam2012*
- Start Client & GUI deamon processes via "$ ./start"
- Stop deamon processes via "$ ./stop"
- Process stout log files: client.log & client_gui.log
- Other usages to monitor processes: "$ forever -h"

####Login, SSH, sudo
- Username: ubuntu
- Password: reverse

#### Disclaimer
Keyboard layout is set to *mac-usb-us*.

If keyboard layout is incorrect for you,

- SSH to "ubuntu@xxx.xxx.xxx.xxx", LAN address found via "ifconfig"
- or, "sudo dpkg-reconfigure keyboard-configuration" to change keyboard layout

