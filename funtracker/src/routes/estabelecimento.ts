import { Router, Request} from 'express';
import { Estabelecimento, GamaPreco, Ordem} from '../model/Estabelecimento';
import { body, oneOf, query} from 'express-validator';
import isLoggedIn from '../middleware/isLoggedIn';
import {hasPermission, isAdmin} from '../middleware/hasPermission';
import {FunTracker} from '../model/FunTracker';
import {UserJwt, getUser} from '../middleware/isLoggedIn';
import { KeyObject } from 'crypto';

const estabelecimentoRouter = Router();

estabelecimentoRouter.post('/',  isLoggedIn, isAdmin, async (req, res) => {
  try {
    console.log(req.body.nome);
    console.log(req.body.lotacao);
    console.log(req.body.rating);
    console.log(req.body.gamaPreco);
    console.log(req.body.categorias);
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
      req.body.categorias,
      req.body.morada,
      req.body.coordenadas,
      req.body.horarioAbertura,
      req.body.horarioFecho,
      req.body.contacto,
    );
    return res.status(200).json(estab);
  } catch (e) {
      if(typeof e == 'number') {
          res.status(e).send(e.toString())
      }
      else {
        res.status(500).send(e);
      }
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

estabelecimentoRouter.post(
  '/:id/addCategoria',
  isLoggedIn,
  // isAdmin,
  body('categoria').exists(),
  async (req, res) => {
    try {
      let newCategoria = await FunTracker.adicionarCategoria( +req.params?.id,req.body.categoria)
      //if(newCategoria) {
        return res.status(200).json(newCategoria)
      //}
      //else {
      //  return res.status(400).json({
      //    success: false,
      //    errors: ["Não foi possível adicionar a uma nova categoria"],
      //  });
      //}
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        errors: [e],
      });
    }
  },
);

estabelecimentoRouter.get('/:id/classificacoes', isLoggedIn, isAdmin, async (req, res) => {
    try{
        return res.status(200).json(await FunTracker.getClassificacoesByEstabelecimentoID(req.body.id));
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
    try {
      const user: UserJwt = getUser(req);
      let newClassificacao = await FunTracker.avaliar(+req.body.valor, req.body.comentario, +req.params?.id,user.id)
      return res.status(200).json(newClassificacao)
    } catch {
      return res.status(500).json({
        success: false,
        errors: ["Não foi possível classificar o estabelecimento"],
      });
    }
  },
);

// FILTROS
estabelecimentoRouter.get(
  '/sort/categorias',
  isLoggedIn, hasPermission,
  async (req, res) => {
    try {
      //TODO Retirar os repetidos
      let estabelecimentos = await FunTracker.getEstabelecimentosBySortedCategorias()
        return res.status(200).json({success: true, estabelecimentos: estabelecimentos})
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        errors: [e],
      });
    }
  },
);

// do mais pequeno para o maior
estabelecimentoRouter.get(
  '/sort/preco',
  isLoggedIn, hasPermission,
  async (req, res) => {
    try {
      let estabelecimentos = await FunTracker.getEstabelecimentosBySortedPreco()
        return res.status(200).json({success: true, estabelecimentos: estabelecimentos})
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        errors: [e],
      });
    }
  },
);

// Do melhor para o pior
estabelecimentoRouter.get(
  '/sort/pontuacao',
  isLoggedIn, hasPermission,
  async (req, res) => {
    try {
      let estabelecimentos = await FunTracker.getEstabelecimentosBySortedPontuacao()
        return res.status(200).json({success: true, estabelecimentos: estabelecimentos})
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        errors: [e],
      });
    }
  },
);

estabelecimentoRouter.get(
  '/filtro/gamaPreco',
  isLoggedIn, hasPermission,
  query('preco').exists(),
  async (req, res) => {
    try {
      let estabelecimentos = await FunTracker.getEstabelecimentosByGamaPreco(req.body.preco)
        return res.status(200).json({success: true, estabelecimentos: estabelecimentos})
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        errors: [e],
      });
    }
  },
);

estabelecimentoRouter.get(
  '/filtros',
  isLoggedIn, hasPermission,
  oneOf( [
    query('order').exists(),
    query('abertos').exists(),
    query('precos').exists(),
  ]), //.withMessage('Tem que especificar pelo menos um, ou a ordem ou se pretende os estabelecimentos abertos'),
  async (req: Request, res) => {
    try {
      let auxAbertos = req.query.abertos
      let auxOrder = req.query.order
      let auxPrecos = req.query.precos

     let abertos :boolean = false;
     let order :Ordem | null = null;
     let precos : GamaPreco | null = null;

      if (auxAbertos) {
        abertos = auxAbertos == 'true' || auxAbertos == '1'
      }

      //TODO falta este
      if (auxOrder) {
        order = Ordem[auxOrder as keyof typeof Ordem]
      }

      if (auxPrecos) {
        precos = GamaPreco[auxPrecos as keyof typeof GamaPreco]
      }

      let estabelecimentos = await FunTracker.getByFiltros(abertos,order,precos)
        return res.status(200).json({success: true, estabelecimentos: estabelecimentos})
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        errors: [e],
      });
    }
  },
);

estabelecimentoRouter.get(
  '/aberto',
  isLoggedIn, hasPermission,
  async (req, res) => {
    try {
      let estabelecimentos = await FunTracker.getEstabelecimentosAbertos()
        return res.status(200).json({success: true, estabelecimentos: estabelecimentos})
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        errors: [e],
      });
    }
  },
);

estabelecimentoRouter.get(
  '/:id',
  isLoggedIn,
  hasPermission,
  async (req, res) => {
    try {
        const number = +req.params.id
        if (isNaN(number)) {
          return res.status(404).json({
            success: false,
            errors: ["Page Not Found"],
          });
        }
        let infoLocal = await FunTracker.getEstabelecimentoByID(number)
        return res.status(200).json(infoLocal)
    } catch {
        return res.status(404).json({
            success: false,
            errors: ["Não Existe Nenhum Estabelecimento com esse ID"],
        });
    }
})

export default estabelecimentoRouter;
