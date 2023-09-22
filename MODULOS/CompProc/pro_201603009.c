#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/init.h>
#include <linux/sched/signal.h>
#include <linux/sched.h>


#include <linux/proc_fs.h>
#include <linux/percpu.h>
#include <linux/seq_file.h>
 
struct task_struct *task;        /*    Structure defined in sched.h for tasks/processes    */
struct task_struct *task_child;        /*    Structure needed to iterate through task children    */
struct list_head *list;            /*    Structure needed to iterate through the list in each task->children struct    */
 







//-----------------------------------------------------------------
static int proc_cpu_show(struct seq_file *m, void *v){
	printk(KERN_INFO "%s","LOADING MODULE\n");    /*    good practice to log when loading/removing modules    */
     
     
seq_printf(m, "[ ");     

	

    for_each_process( task ){            
    
    int ix=0;
    
       
        list_for_each(list, &task->children){                     
 
            task_child = list_entry( list, struct task_struct, sibling );    /*using list_entry to declare all vars in task_child struct */
            /*printk(KERN_INFO "\nCHILD OF %s[%d] PID: %d PROCESS: %s STATE: %ld",task->comm, task->pid, task_child->pid, task_child->comm, task_child->state);*/
            
            /*"{ \"PARENT PID\": %d, \"PROCESS\": \"%s\" , \"STATE\": %ld  , \"PIDCHILD\": %d  , \"PROCESSCHILD\": \"%s\", \"STATECHILD\": %ld   },"*/
            
            
            
seq_printf(m, "{ \"PARENT_PID\": %d, \"PROCESS\": \"%s\" , \"STATE\": %ld  , \"PIDCHILD\": %d  , \"PROCESSCHILD\": \"%s\", \"STATECHILD\": %ld   },",task->pid, task->comm, task->__state, task_child->pid, task_child->comm, task_child->__state);
            
           if(ix==12){
           	break;
           } 
            ix++;
        }
        
        
        
    }    
     

seq_printf(m, "{\"PARENT_PID\":0 ,\"PROCESS\": \"kevin-ruiz\" ,\"STATE\":0,\"PIDCHILD\":0,\"PROCESSCHILD\":\"201603009\",\"STATECHILD\":0}] ");    

    
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
	entry = proc_create("pro_201603009", 0777, NULL, &my_fops);

	if(!entry){
		return -1;
	}else{
		printk(KERN_INFO "Kevin Golwer Enrique Ruiz Barbales, Cargado\n");
	}

	return 0;
}

//Funcion de fin
static void __exit module_cpu_exit(void){
	printk(KERN_INFO "Segundo semestre 2022, PRO Desmontado\n");
}

//Se indica cuales son las funciones de inicio y fin
module_init(module_cpu_init);
module_exit(module_cpu_exit);
MODULE_LICENSE("GPL");

