CREATE DATABASE database_links;
use database_links;

Create table users(
    id_user int not null,
    username varchar(16) not null,
    password varchar(60) not null,
    fullname varchar(100) not null

); 

alter table users add constraint pk_user primary key(id_user);
alter table users 
modify id_user int not null AUTO_INCREMENT, AUTO_INCREMENT =2;


Create table links(
    id_link int not null,
    title varchar(100) not null,
    url varchar(100) not null,
    description text not null,
    user_id int not null,
    create_at timestamp not null  default current_timestamp

); 

alter table links add constraint fk_link foreign key(user_id) references users(id_user);
alter table links add constraint pk_link primary key(id_link);
alter table links modify id_link int not null AUTO_INCREMENT, AUTO_INCREMENT =2;
