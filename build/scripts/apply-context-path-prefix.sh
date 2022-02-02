#!/bin/bash

if [[ -v CONTEXT_PATH_PREFIX ]];then
    echo "applying context path prefix $CONTEXT_PATH_PREFIX"  
	
    temp_nginx_conf=/tmp/nginx.conf
    temp_index_html=/tmp/index.html
	
    cp $1 $temp_nginx_conf
    cp $2 $temp_index_html
	
    context="${CONTEXT_PATH_PREFIX//\//\\\/}"
    sed -i -E "s/(location )((\/config\/frontend)|(\/config\/backend)|(\/api))\s/\1${context}\2 /" $temp_nginx_conf
    sed -i -E "s/(location \/)\s/\1${context:2} /" $temp_nginx_conf
    sed -i -E "s/rewrite\s\^\/api\//rewrite ^$context\/api\//" $temp_nginx_conf
    sed -i -E "s/#\srewrite\sCONTEXT_PATH_PREFIX/rewrite ^$context/" $temp_nginx_conf
    sed -i -E "s/base\shref=\"\/\"/base href=\"$context\/\"/" $temp_index_html
	
	
	# rewrite CONTEXT_PATH_PREFIX
    cat $temp_nginx_conf >$1
    cat $temp_index_html >$2
fi
