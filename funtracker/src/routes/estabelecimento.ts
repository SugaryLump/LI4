import express, { Router, Request } from 'express';
import { Categoria, Estabelecimento, GamaPreco, Ordem } from '../model/Estabelecimento';
import { body, oneOf, param, query } from 'express-validator';
import isLoggedIn from '../middleware/isLoggedIn';
import { hasPermission, isAdmin } from '../middleware/hasPermission';
import { FunTracker } from '../model/FunTracker';
import { UserJwt, getUser } from '../middleware/isLoggedIn';
import { KeyObject } from 'crypto';
import Multer from 'multer'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { checkValidation } from '../middleware/checkValidation';
import { type } from 'os';

const estabelecimentoRouter = Router();

async function getDestination(fileType: string): Promise<string> {
  if (!existsSync('images/')) {
    await mkdir('images/')
  }

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
  let extension = ""
  if (fileType == "image/png") {
    extension = ".png"
  } else if (fileType == "image/jpeg") {
    extension = ".jpg"
  }

  return "images/image-" + uniqueSuffix + extension
}

estabelecimentoRouter.post('/',
  isLoggedIn, isAdmin,
  body('nome').isString().isLength({ min: 1 }).withMessage("Nome é obrigatório"),
  body('lotacao').isNumeric().withMessage('Lotação tem de ser um número').bail().toInt(), body('gamaPreco').matches(/^(\$|\$\$|\$\$\$)$/).withMessage("Tem de ser entre um a 3 $"),
  body('morada').isString().isLength({ min: 1 }).withMessage('Morada é obrigatória'),
  body('coordenadas').isObject(),
  body('horarioAbertura').isString().withMessage('Horário de abrtura é obrigatório'),
  body('horarioFecho').isString().withMessage('Horário de fecho é obrigatório'),
  body('contacto').isString().withMessage('Contacto é obrigatório').isLength({ min: 9, max: 9 }),
  body('categorias').isArray().withMessage("Categorias tem de ser um array"),
  body('image').exists().withMessage("Imagem tem de ser um array base64"),
  body('fileMime').isMimeType(),
  checkValidation, async (req, res) => {
    try {
      const estab: Estabelecimento = await FunTracker.criaEstabelecimento(
        req.body.nome,
        req.body.lotacao,
        0,
        req.body.gamaPreco,
        req.body.categorias,
        req.body.morada,
        req.body.coordenadas,
        req.body.horarioAbertura,
        req.body.horarioFecho,
        req.body.contacto,
      );

      let fileName = await getDestination(req.body.fileMime)
      await writeFile(fileName, req.body.image, 'base64')

      await FunTracker.adicionarImagen(estab.id, fileName)

      return res.status(200).json({
        success: true,
        estabelecimento: estab
      });
    } catch (e) {
      // console.log(e)
      if (typeof e == 'number') {
        return res.status(400).json({
          success: false,
          errors: [e.toString()]
        })
      }
      else {
        res.status(500).json({
          success: false,
          errors: ["Erro de servidor"]
        });
      }
    }
  });


estabelecimentoRouter.get('/',
  isLoggedIn,
  query('order').exists(),
  query('aberto').exists(),
  query('precos').exists(),
  query('latitude').exists(),
  query('longitude').exists(),
  query('categorias').exists(),
  query('nome').exists(),
  // checkValidation(),
  async (req: Request, res) => {
  try {
    let auxAbertos = req.query.aberto
    let auxOrder = req.query.order
    let auxPrecos = req.query.precos
    let auxCategorias = req.query.categorias
    let nome = req.query.nome

    if(auxAbertos === undefined && auxOrder === undefined && auxPrecos === undefined && auxCategorias===undefined && nome===undefined){
      const estab: Estabelecimento[] = await FunTracker.getEstabelecimentos()
      return res.status(200).json({success: true, estabelecimentos: estab})
    }

    if (nome) {
      const estab: Estabelecimento[] = await FunTracker.getEstabelecimentoByName(nome.toString())
      return res.status(200).json({success: true, estabelecimentos: estab})
    }

    let abertos: boolean = false;
    let order: Ordem | null = null;
    let precos: GamaPreco | null = null;
    let coords: {latitude:string, longitude: string} | null = null;
    let categorias: Categoria[] | null = null;

    if (auxAbertos) {
      abertos = auxAbertos == 'true' || auxAbertos == '1'
    }

    if (auxOrder) {
      order = Ordem[auxOrder as keyof typeof Ordem]
    }

    if (auxPrecos) {
      precos = GamaPreco[auxPrecos as keyof typeof GamaPreco]
    }

    if(req.query.latitude !== undefined && req.query.longitude) {
      coords = {latitude: req.query.latitude as string , longitude: req.query.longitude as string}
    }

    if (auxCategorias) {
      categorias = []
      auxCategorias.toString().split(",").forEach(e => {
        if (categorias!= null)
          categorias.push(Categoria[e as keyof typeof Categoria])
      })
    }

    let estabelecimentos = await FunTracker.getByFiltros(abertos, order, precos, coords,categorias)
    return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
  }
  catch (e) {
    return res.status(404).json({
      success: false,
      errors: ["Não existem estabelecimentos ou " + e],
    });
  }
})

// estabelecimentoRouter.get('/',
//     isLoggedIn,
//     async (req: Request, res) => {
//   try {
//     let estabelecimentos = await FunTracker.getEstabelecimentos()
//     return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
//   }
//   catch (e) {
//     return res.status(404).json({
//       success: false,
//       errors: ["Não existem estabelecimentos"],
//     });
//   }
// })

estabelecimentoRouter.get(
  '/:id/allImagens',
  isLoggedIn,
  async (req, res) => {
    let allImagens = await FunTracker.getAllImagensByEstabelecimentoID(+req.params?.id);

    if (allImagens) {
      return res.status(200).json({success: true, imagem: allImagens});
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
    let newImagen = FunTracker.adicionarImagen(+req.params?.id, req.body.filepath)
    if (newImagen) {
      return res.status(200).json({success: true,imagem: newImagen})
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
  isAdmin,
  body('categoria').exists(),
  async (req, res) => {
    try {
      let newCategoria = await FunTracker.adicionarCategoria(+req.params?.id, req.body.categoria)
      return res.status(200).json({success: true, categoria: newCategoria})
    } catch (e: any) {
      return res.status(400).json({
        success: false,
        errors: [e],
      });
    }
  },
);

estabelecimentoRouter.get('/:id/classificacoes', isLoggedIn,
                          async (req, res) => {
  try {
    return res.status(200).json({success:true, classificacoes: await FunTracker.getClassificacoesByEstabelecimentoID(+req.params?.id)});
  } catch {
    return res.status(404).json({
      success: false,
      errors: ["Não existem classificações para este estabelecimento"],
    });
  }
});

estabelecimentoRouter.get('/:id/classificacoes/num', isLoggedIn,
                          async (req, res) => {
  try {
    return res.status(200).json({success:true, num: await FunTracker.getClassificacoesNumByEstabelecimentoID(+req.params?.id)});
  } catch {
    return res.status(404).json({
      success: false,
      errors: ["Não existem classificações para este estabelecimento"],
    });
  }
});

estabelecimentoRouter.post(
  '/:id/classificacoes',
  isLoggedIn,
  body('valor').exists(),
  body('comentario').exists(),
  checkValidation,
  async (req, res) => {
    try {
      const user: UserJwt = getUser(req);
      let newClassificacao = await FunTracker.avaliar(+req.body.valor, req.body.comentario, +req.params?.id, user.id)
        // console.log(newClassificacao)
      return res.status(200).json({ success: true, classificacao: newClassificacao })
    } catch(e) {
      console.log(e)
      return res.status(400).json({
        success: false,
        errors: [e]
      });
    }
  },
);

estabelecimentoRouter.get('/:id',
  isLoggedIn,
  param('id').isNumeric(),
  checkValidation,
  async (req, res) => {
    try {
      const number = +req.params.id
      let infoLocal = await FunTracker.getEstabelecimentoByID(number)
      return res.status(200).json({
        success: true,
        estabelecimento: infoLocal
      })
    } catch (e) {
      console.log(e)
      return res.status(404).json({
        success: false,
        errors: ["Não Existe Nenhum Estabelecimento com esse ID"],
      });
    }
  })

estabelecimentoRouter.delete(
  '/:id',
  isLoggedIn,
  isAdmin,
  async (req, res) => {
    try {
      const n = +req.params.id
      if (isNaN(n)) {
        return res.status(400).json({
          success: false,
          errors: ["Invalid ID"],
        });
      }
        await FunTracker.removeEstabelecimentoByID(n)
      return res.status(200).json({success: true, id: `Estabelecimento com ID ${req.params.id} removido`})
    } catch {
      return res.status(404).json({
        success: false,
        errors: ["Não Existe Nenhum Estabelecimento com esse ID"],
      });
    }
  })


export default estabelecimentoRouter;
