import { Container } from "inversify";
import TYPES from "../TYPES";
import IdGenerator from 'services/IdGenerator';

var container = new Container();
container.bind<app.services.IdGeneratorInterface>(TYPES.IdGenerator).to(IdGenerator);

export default container;
