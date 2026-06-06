# Yoga App

## Description

Application de gestion des sessions d'un studio de yoga.

## Installation

### Backend

Pour faire fonctionner le backend, vous devez disposer au préalable de :
- JDK 21.
- Docker et Docker compose.
- [Maven](https://archive.apache.org/dist/maven/maven-3/3.9.3/binaries/) >= 3.9.3

Ensuite, il vous suffit de cloner le dépot du projet.

### Frontend

Ce projet a été généré avec Ce projet a été généré avec [Angular CLI](https://github.com/angular/angular-cli) version 19.2.16.

1) Après avoir cloné le dépot du projet, rendez-vous dans le dossier `front`.
2) Lancez la commande `npm install` pour installer les dépendances requises.

## Démarrage

Pour faire fonctionner l'ensemble de l'application, vous devez disposer du `backend` **ET** du `frontend` en fonctionnement.
Le `backend` est indépendant mais le `frontend` **nécessite** le lancement du `backend` pour fonctionner.

### Backend

1) Si vous êtes sur Windows, assurez-vous que Docker Desktop est bien démarré.
2) Rendez-vous dans le dossier `back`, puis exécutez la commande `mvn spring-boot:run`.

### Frontend

1) Rendez-vous dans le dossier `front`.
2) Lancez la commande `ng serve`.
3) Cliquez sur le lien généré par l'application ou reportez l'url indiquée dans la barre de votre navigateur.

## Tests

### Backend

Pour lancer les tests, rendez-vous dans le dossier `back` et lancez la commande `mvn clean test`.
Le rapport est alors consultable via le fichier suivant `./target/site/jacoco/index.html`.

### Frontend

Pour lancer les tests veuillez lancer l'application avec le coverage.
Pour ce faire, rendez-vous dans le dossier `front`, et lancez la commande `ng run yoga:serve-coverage`.

Pour lancer les tests unitaires : 
1) Dans un autre terminal.
2) Allez dans le dossier `front`.
3) Lancez la commande `npx jest --coverage`.
Le rapport est alors consultable via le fichier suivant `front/coverage/jest/index.html`.

Pour lancer les tests end to end (e2e) :
1) Dans un autre terminal.
2) Allez dans le dossier `front`.
3) Lancez la commande `npx cypress run`.
Le rapport est alors consultable via le fichier suivant `front/coverage/lcov-report/index.html`.