create database productos_db;

use productos_db;

create table productos (
    id int auto_increment primary key,
    nombre varchar(100) not null,
    descripcion varchar(200),
    precio decimal(15,2),
    imagen varchar(255)
);
