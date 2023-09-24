FROM joeshaw/busybox-nonroot
MAINTAINER BACK
RUN echo $(date +%s%N)> /id.txt
COPY server /
RUN mkdir /modulos
EXPOSE 8080
CMD ["/server"]




