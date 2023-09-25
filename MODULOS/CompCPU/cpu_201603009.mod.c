#include <linux/module.h>
#define INCLUDE_VERMAGIC
#include <linux/build-salt.h>
#include <linux/elfnote-lto.h>
#include <linux/vermagic.h>
#include <linux/compiler.h>

BUILD_SALT;
BUILD_LTO_INFO;

MODULE_INFO(vermagic, VERMAGIC_STRING);
MODULE_INFO(name, KBUILD_MODNAME);

__visible struct module __this_module
__section(".gnu.linkonce.this_module") = {
	.name = KBUILD_MODNAME,
	.init = init_module,
#ifdef CONFIG_MODULE_UNLOAD
	.exit = cleanup_module,
#endif
	.arch = MODULE_ARCH_INIT,
};

#ifdef CONFIG_RETPOLINE
MODULE_INFO(retpoline, "Y");
#endif

static const struct modversion_info ____versions[]
__used __section("__versions") = {
	{ 0xc4162456, "module_layout" },
	{ 0xd027439d, "single_release" },
	{ 0xead3cacc, "seq_lseek" },
	{ 0x3b7e6611, "seq_read" },
	{ 0x92997ed8, "_printk" },
	{ 0x13ace33c, "proc_create" },
	{ 0x87a21cb3, "__ubsan_handle_out_of_bounds" },
	{ 0xa1e158d0, "seq_printf" },
	{ 0xb58aeaab, "kernel_cpustat" },
	{ 0xb19a5453, "__per_cpu_offset" },
	{ 0x9e683f75, "__cpu_possible_mask" },
	{ 0x5b8239ca, "__x86_return_thunk" },
	{ 0xb387c1b, "single_open" },
	{ 0xbdfb6dbb, "__fentry__" },
};

MODULE_INFO(depends, "");


MODULE_INFO(srcversion, "5DE59A73FF6639E8957C9E6");
