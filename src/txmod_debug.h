#ifndef DEBUG_H
#define DEBUG_H

#include <Arduino.h>

//#define DEBUG_USE_SW_SERIAL 1
#define DEBUG_DISABLE 
//#define DEBUG_WEB

void debug_init();
void debug_println(String line);
void debug_print(String str);
void debug_flush();

#define debug_crit_println(X) \
    debug_serial_println(String(X)); \
    debug_flush()
#define debug_crit_print(X) \
    debug_serial_print(String(X)); \
    debug_flush()

#ifdef DEBUG_DISABLE
#define debug_serial_println(X)
#define debug_serial_print(X)
#else
#define debug_serial_println(X) debug_println(String(X))
#define debug_serial_print(X) debug_print(String(X))
#endif

#endif