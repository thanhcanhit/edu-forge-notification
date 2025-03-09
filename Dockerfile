docker run -d `
  --name mongo `
  -p 27017:27017 `
  mongo --replSet rs0 --bind_ip_all

  docker exec -it mongo mongosh
  rs.initiate({ _id: "rs0", members: [ { _id: 0, host: "localhost:27017" } ] })