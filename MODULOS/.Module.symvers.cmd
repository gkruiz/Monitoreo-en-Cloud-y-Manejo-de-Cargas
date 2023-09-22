cmd_/home/m/PruebasSO1/Module.symvers := sed 's/\.ko$$/\.o/' /home/m/PruebasSO1/modules.order | scripts/mod/modpost -m -a  -o /home/m/PruebasSO1/Module.symvers -e -i Module.symvers   -T -
