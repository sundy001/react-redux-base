import { Container } from "inversify";
import TYPES from "../TYPES";
import { IdGenerator, IdGeneratorInterface} from 'services/IdGenerator';

var container = new Container();
container.bind<IdGeneratorInterface>(TYPES.IdGenerator).to(IdGenerator);

export default container;
