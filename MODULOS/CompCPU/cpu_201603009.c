#include <linux/module.h>
#include <linux/init.h>
#include <linux/mm.h>
#include <linux/mmzone.h>
#include <linux/blkdev.h>
#include <linux/list.h>
#include <linux/swap.h>
#include <linux/cpumask.h>
#include <linux/kernel_stat.h>

#include <linux/proc_fs.h>
#include <linux/percpu.h>
#include <linux/seq_file.h>

// get the user cpu time for cpu c
// get the nice cpu time for cpu c
// get the system cpu time for cpu c
// get the idle cpu time for cpu c
// get the iowait cpu time for cpu c
// get the hardware irq cpu time for cpu c
// get the soft irq cpu time for cpu c
// get the steal cpu time for cpu c

//-----------------------------------------------------------------
static int proc_cpu_show(struct seq_file *m, void *v){
	unsigned long cpu_bit = *((unsigned long *)cpu_possible_mask->bits);
	unsigned long idx = cpu_bit;

    unsigned long cpu_user = 0, cpu_nice = 0, cpu_sys = 0, cpu_idle = 0;
    unsigned long cpu_iowait = 0, cpu_hirq = 0, cpu_sirq = 0, cpu_steal = 0;
	unsigned long cpu_total = 0, cpu_usado = 0;
	/*cpu_user   = 0;
	cpu_nice   = 0;
	cpu_sys    = 0;
	cpu_idle   = 0;
	cpu_iowait = 0;
	cpu_hirq   = 0;
	cpu_sirq   = 0;
	cpu_steal  = 0;**/

	int c = 0;

	while(idx){
        struct kernel_cpustat *base = (struct kernel_cpustat *)((unsigned long)__per_cpu_offset[c]+(unsigned long)&kernel_cpustat);
		cpu_user   += base->cpustat[CPUTIME_USER];
		cpu_nice   += base->cpustat[CPUTIME_NICE];
		cpu_sys    += base->cpustat[CPUTIME_SYSTEM];
		cpu_idle   += base->cpustat[CPUTIME_IDLE];
		cpu_iowait += base->cpustat[CPUTIME_IOWAIT];
		cpu_hirq   += base->cpustat[CPUTIME_IRQ];
		cpu_sirq   += base->cpustat[CPUTIME_SOFTIRQ];
		cpu_steal  += base->cpustat[CPUTIME_STEAL];

		c++;
		idx = idx >> 1;
		// probably convert with cputime64_to_clock_t
	}

    //unsigned long cpu_total, cpu_usado;
	cpu_total = cpu_user + cpu_nice + cpu_sys + cpu_idle + cpu_iowait+ cpu_hirq + cpu_sirq + cpu_steal;
    cpu_usado = cpu_idle + cpu_iowait;
    cpu_usado = cpu_total - cpu_usado;

    seq_printf(m, "[{ \"cpu_usado\": %lu, \"cpu_total\": %lu }]", cpu_usado, cpu_total);
	return 0;
}


static ssize_t escribir(struct file* file, const char __user *buffer, size_t count, loff_t *f_pos){
    return 0;
}

static int abrir(struct inode *inode, struct file *file){
    return single_open(file, proc_cpu_show, NULL);
}


/*
static struct file_operations my_fops={
    .owner = THIS_MODULE,
    .open = abrir,
    .release = single_release,
    .read = seq_read,
    .llseek = seq_lseek,
    .write = escribir
};

*/

static const struct proc_ops my_fops = {
  .proc_open = abrir,
  .proc_read = seq_read,
  .proc_lseek = seq_lseek,
  .proc_release = single_release,
};

//Funcion de inicio
static int __init module_cpu_init(void){
    //Si no se devuelve 0 significa que initmodule ha fallado y no ha podido cargarse.

	struct proc_dir_entry *entry;
	entry = proc_create("cpu_201603009", 0777, NULL, &my_fops);

	if(!entry){
		return -1;
	}else{
		printk(KERN_INFO "Kevin Golwer Enrique Ruiz Barbales, Cargado\n");
	}

	return 0;
}

//Funcion de fin
static void __exit module_cpu_exit(void){
	printk(KERN_INFO "Segundo semestre 2022, CPU Desmontado\n");
}

//Se indica cuales son las funciones de inicio y fin
module_init(module_cpu_init);
module_exit(module_cpu_exit);
MODULE_LICENSE("GPL");
