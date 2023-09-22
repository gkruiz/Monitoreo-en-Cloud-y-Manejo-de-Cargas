#include <linux/module.h>	//Todo los modulos lo necesitan
#include <linux/init.h>		//Proporciona las macros inico y fin
#include <linux/fs.h>
#include <linux/kernel.h>
#include <linux/mm.h>
#include <linux/hugetlb.h>
#include <linux/mman.h>
#include <linux/mmzone.h>
#include <linux/proc_fs.h>
#include <linux/percpu.h>
#include <linux/seq_file.h>
#include <linux/swap.h>
#include <linux/vmstat.h>
#include <linux/atomic.h>
#include <linux/vmalloc.h>
#ifdef CONFIG_CMA
#include <linux/cma.h>
#endif
#include <asm/page.h>
#include <asm/pgtable.h>

extern unsigned long total_swapcache_pages(void);
#define total_swapcache_pages()             0UL

static int proc_ram_show(struct seq_file *m, void *v){
	unsigned long mem_total, mem_libre, mem_buffer, mem_usado;
	long mem_cache;

	struct sysinfo info;
	si_meminfo(&info);

	mem_total = info.totalram << (PAGE_SHIFT - 10);
	mem_libre = info.freeram << (PAGE_SHIFT - 10);
	mem_buffer = info.bufferram << (PAGE_SHIFT - 10);
    
	mem_cache = global_node_page_state(NR_FILE_PAGES) - total_swapcache_pages() - mem_buffer;

	if(mem_cache < 0){
		mem_cache = 0;
	}
	mem_cache = mem_cache << (PAGE_SHIFT - 10);
	mem_usado = mem_total - (mem_libre + mem_cache + mem_buffer);
	
	
	unsigned long mem_usa_por=((mem_usado/mem_total)*100); 

	seq_printf(m, "[{\"mem_usado\": %lu, \"mem_total\": %lu, \"mem_usado_porc\": %lu, \"mem_libre\": %lu }]", mem_usado, mem_total,(mem_usa_por),(mem_total-mem_usado));
	return 0;
}


static ssize_t escribir(struct file* file, const char __user *buffer, size_t count, loff_t *f_pos){
    return 0;
}

static int abrir(struct inode *inode, struct file *file){
    return single_open(file, proc_ram_show, NULL);
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
static int __init module_ram_init(void){
	//Si no se devuelve 0 significa que initmodule ha fallado y no ha podido cargarse.

	struct proc_dir_entry *entry;
	entry = proc_create("ram_201603009", 0777, NULL, &my_fops);

	if(!entry){
		return -1;
	}else{
		printk(KERN_INFO "Kevin Golwer Enrique Ruiz Barbales, Cargado\n");
		
	}
	return 0;
}

//Funcion de fin
static void __exit module_ram_exit(void){
	remove_proc_entry("ram_201603009",NULL);
	printk(KERN_INFO "Segundo semestre 2022, RAM Desmontado\n");
}

//Se indica cuales son las funciones de inicio y fin
module_init(module_ram_init);
module_exit(module_ram_exit);
MODULE_LICENSE("GPL");
