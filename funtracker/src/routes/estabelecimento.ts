import {Router} from 'express';
import {Estabelecimento} from '../model/Estabelecimento';
import {body} from 'express-validator';
import isLoggedIn from '../middleware/isLoggedIn';
import {hasPermission, isAdmin} from '../middleware/hasPermission';
import {FunTracker} from '../model/FunTracker';
import {UserJwt, getUser} from '../middleware/isLoggedIn';

const estabelecimentoRouter = Router();

estabelecimentoRouter.post('/', isLoggedIn, isAdmin, async (req, res) => {
  try {
    console.log(req.body.nome);
    console.log(req.body.lotacao);
    console.log(req.body.rating);
    console.log(req.body.gamaPreco);
    console.log(req.body.categoria);
    console.log(req.body.morada);
    console.log(req.body.coordenadas);
    console.log(req.body.horarioAbertura);
    console.log(req.body.horarioFecho);
    console.log(req.body.contacto);
    const estab: Estabelecimento = await FunTracker.criaEstabelecimento(
      req.body.nome,
      req.body.lotacao,
      req.body.rating,
      req.body.gamaPreco,
      req.body.categoria,
      req.body.morada,
      req.body.coordenadas,
      req.body.horarioAbertura,
      req.body.horarioFecho,
      req.body.contacto,
    );
    return res.status(200).json(estab);
  } catch (e) {
    console.log('rip');
    res.status(500).send(e);
  }
});

estabelecimentoRouter.get('/', isLoggedIn, async (req, res) => {
    try {
        const estab : Estabelecimento[] = await FunTracker.getEstabelecimentos()
        return res.status(200).json(estab)
    }
    catch(e) {
      return res.status(404).json({
        success: false,
        errors: ["Não existem estabelecimentos"],
      });
    }
})

estabelecimentoRouter.get(
  '/:id',
  isLoggedIn,
  hasPermission,
  async (req, res) => {
    try {
        let infoLocal = await FunTracker.getEstabelecimentoByID(+req.params.id)
        return res.status(200).json(infoLocal)
    } catch {
        return res.status(404).json({
            success: false,
            errors: ["Não Existe Nenhum Estabelecimento com esse ID"],
        });
    }
})

estabelecimentoRouter.get(
  '/:id/allImagens',
  isLoggedIn,
  hasPermission,
  async (req, res) => {
    let allImagens = await FunTracker.getAllImagensByEstabelecimentoID(
      req.body.id,
    );

    if (allImagens) {
      return res.status(200).json(allImagens);
    }
    else {
        return res.status(404).json({
            success: false,
            errors: ["Não existem imagens associadas"],
        });
    }
})


// Maybe mandar mesmo a imagem, fazer dowload dela e devolver o filepath
estabelecimentoRouter.post(
  '/:id/adicionarImagem',
  isLoggedIn,
  isAdmin,
  body('filepath').exists(),
  async (req, res) => {
    let newImagen = FunTracker.adicionarImagen(req.body.id,req.body.filepath)
    if(newImagen) {
        return res.status(200).json(newImagen)
    }
    else {
      return res.status(500).json({
        success: false,
        errors: ["Não foi possível adicionar a imagem"],
      });
    }
  },
);

estabelecimentoRouter.get('/:id/classificacoes', isLoggedIn, isAdmin, async (req, res) => {
    try{
        return res.status(200).json(FunTracker.getClassificacoesByEstabelecimentoID(req.body.id));
    } catch {
      return res.status(404).json({
        success: false,
        errors: ["Não existem classificações para este estabelecimento"],
      });
    }
});
estabelecimentoRouter.post(
  '/:id/avaliar',
  isLoggedIn,
  hasPermission,
  body('valor').exists(),
  body('comentario').exists(),
  async (req, res) => {
    const user: UserJwt = getUser(req);
    let newClassificacao = FunTracker.avaliar(+req.body.valor, req.body.comentario, +req.params?.id,user.id)
    if(newClassificacao) {
        return res.status(200).json(newClassificacao)
    }
    else {
      return res.status(500).json({
        success: false,
        errors: ["Não foi possível classificar o estabelecimento"],
      });
    }
  },
);

export default estabelecimentoRouter;
