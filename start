forever stopall
forever start -o ./client.log Client/main.js
forever start -o ./client_gui.log Client_GUI/main.js
echo " "
echo "               o|    |                      |         o          "
echo ",-.-.,---.,---..|    |        ,---.,---.,---|,---.    .,---.,-.-."
echo "| | ||    |   |||    |        |    |   ||   ||---'    |,---|| | |"
echo "\` ' '\`---'\`---|\`\`---'\`---'    \`---'\`---'\`---'\`---'    |\`---^\` ' '"
echo "          \`---'                                   \`---'          "
echo "November 16-18, 2012       Adrian Lee <adrian.lee@mail.mcgill.ca>"
echo " "
echo " - 2 deamon processes created, run './stop.sh' to kill processes."
echo " "
echo " - Visit http://<ip address below>:8080 to access the Client's GUI interface"
echo " "
echo "VM LAN IP Address:"
ifconfig | grep 'inet addr:'| grep -v '127.0.0.1' | cut -d: -f2 | awk '{print $1}'
echo " "
echo "Tailing output log file 'client.log':"
echo "====================================="
tail -f ./client.log
