FROM golang

WORKDIR /go

RUN go get github.com/graphql-go/graphql
RUN go get github.com/cespare/reflex

CMD reflex --decoration=none --start-service -r "\.go$" -- sh -c 'go install main && /go/bin/main'


# # build stage
# FROM golang:1.10 AS build-env
#
# ADD . /src
#
# RUN cd /src \
#     && go get github.com/graphql-go/graphql \
#     && go get github.com/cespare/reflex \
#     && go build -o goapp
# # RUN cd /src && go build -o goapp
#
# # final stage
# FROM alpine
#
# WORKDIR /app
#
# COPY --from=build-env /src/goapp /app/
#
# ENTRYPOINT ./goapp
