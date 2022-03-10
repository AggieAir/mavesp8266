@SET VERSION=V2.10

del .pio\build\esp12e\firmware.bin
del .pio\build\esp12e\spiffs.bin
del firmware.bin
del spiffs.bin

@REM build firmare.bin binary:
platformio run
@REM build spiffs.bin binary:
platformio run -t buildfs

@REM copy the target binaries to a releasable name:
copy .pio\build\esp12e\spiffs.bin .
rename spiffs.bin RFDTxMod-v2_spiffs%VERSION%.bin
copy .pio\build\esp12e\firmware.bin .
rename firmware.bin RFDTxMod-v2_%VERSION%.bin

echo ------------------------------------------------------------------
@REM show user:
@dir RFDTx*.bin
pause