import { Router, Request } from 'express';
import { Estabelecimento, GamaPreco, Ordem } from '../model/Estabelecimento';
import { body, oneOf, query } from 'express-validator';
import isLoggedIn from '../middleware/isLoggedIn';
import { hasPermission, isAdmin } from '../middleware/hasPermission';
import { FunTracker } from '../model/FunTracker';
import { UserJwt, getUser } from '../middleware/isLoggedIn';
import { KeyObject } from 'crypto';
import Multer from 'multer'
import { exists } from 'fs'
import { mkdir } from 'fs/promises'
import { checkValidation } from '../middleware/checkValidation';
import { type } from 'os';

const estabelecimentoRouter = Router();

const storage = Multer.diskStorage({
  destination: (req, file, cb) => {
    exists('images/', exists => {
      if (!exists) {
        mkdir('images/').then(() => {
          cb(null, 'images/')
        })
      } else {
        cb(null, 'images/')
      }
    })
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
    let extension = ""
    if (file.mimetype == "image/png") {
      extension = ".png"
    } else if (file.mimetype == "image/jpeg") {
      extension = ".jpg"
    }

    cb(null, file.fieldname + "-" + uniqueSuffix + extension)
  }
})

const upload = Multer({ storage })

estabelecimentoRouter.post('/',
  isLoggedIn, isAdmin, upload.single('image'),
  body('nome').isString().isLength({ min: 1 }).withMessage("Nome é obrigatório"),
  body('lotacao').isNumeric().withMessage('Lotação tem de ser um número').bail().toInt(), body('gamaPreco').matches(/^(\$|\$\$|\$\$\$)$/).withMessage("Tem de ser entre um a 3 $"),
  body('morada').isString().isLength({ min: 1 }).withMessage('Morada é obrigatória'),
  body('coordenadas').isJSON().withMessage("Tem de ser objeto coordenadas").bail().customSanitizer(coordenadas => JSON.parse(coordenadas)).isObject(),
  body('horarioAbertura').isString().withMessage('Horário de abrtura é obrigatório'),
  body('horarioFecho').isString().withMessage('Horário de fecho é obrigatório'),
  body('contacto').isString().withMessage('Contacto é obrigatório').isLength({ min: 9, max: 9 }),
  body('categorias').isJSON().bail().customSanitizer((categorias: string) => JSON.parse(categorias)).isArray().withMessage('Categorias deve ser um array'),
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
      return res.status(200).json({
        success: true,
        estabelecimento: estab
      });
    } catch (e) {
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
    hasPermission,
    query('order').exists(),
    query('abertos').exists(),
    query('precos').exists(),
    async (req: Request, res) => {
  try {
    let auxAbertos = req.query.abertos
    let auxOrder = req.query.order
    let auxPrecos = req.query.precos
    if(auxAbertos === undefined && auxOrder === undefined && auxPrecos === undefined){
      const estab: Estabelecimento[] = await FunTracker.getEstabelecimentos()
      return res.status(200).json(estab)
    }

    let abertos: boolean = false;
    let order: Ordem | null = null;
    let precos: GamaPreco | null = null;

    if (auxAbertos) {
      abertos = auxAbertos == 'true' || auxAbertos == '1'
    }

    if (auxOrder) {
      order = Ordem[auxOrder as keyof typeof Ordem]
      console.log(order)
      console.log(auxOrder)
      console.log(auxOrder as keyof typeof Ordem)
    }

    if (auxPrecos) {
      precos = GamaPreco[auxPrecos as keyof typeof GamaPreco]
    }

    let estabelecimentos = await FunTracker.getByFiltros(abertos, order, precos)
    return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
  }
  catch (e) {
    return res.status(404).json({
      success: false,
      errors: ["Não existem estabelecimentos"],
    });
  }
})
estabelecimentoRouter.get('/',
    isLoggedIn,
    hasPermission,
    query('order').exists(),
    query('abertos').exists(),
    query('precos').exists(),
    async (req: Request, res) => {
  try {
    let auxAbertos = req.query.abertos
    let auxOrder = req.query.order
    let auxPrecos = req.query.precos
    if(auxAbertos===undefined && auxOrder===undefined && auxPrecos===undefined){
      const estab: Estabelecimento[] = await FunTracker.getEstabelecimentos()
      return res.status(200).json(estab)
    }

    let abertos: boolean = false;
    let order: Ordem | null = null;
    let precos: GamaPreco | null = null;

    if (auxAbertos) {
      abertos = auxAbertos == 'true' || auxAbertos == '1'
    }

    //TODO falta este
    if (auxOrder) {
      order = Ordem[auxOrder as keyof typeof Ordem]
      console.log(order)
      console.log(auxOrder)
      console.log(auxOrder as keyof typeof Ordem)
    }

    if (auxPrecos) {
      precos = GamaPreco[auxPrecos as keyof typeof GamaPreco]
    }

    let estabelecimentos = await FunTracker.getByFiltros(abertos, order, precos)
    return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
  }
  catch (e) {
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
    let newImagen = FunTracker.adicionarImagen(req.body.id, req.body.filepath)
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

estabelecimentoRouter.get('/:id/classificacoes', isLoggedIn, hasPermission, async (req, res) => {
  try {
    return res.status(200).json({success:true, classificacao: await FunTracker.getClassificacoesByEstabelecimentoID(req.body.id)});
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
      let newClassificacao = await FunTracker.avaliar(+req.body.valor, req.body.comentario, +req.params?.id, user.id)
      return res.status(200).json({success: true,classificacao:newClassificacao})
    } catch(e) {
      return res.status(500).json({
        success: false,
        errors: [e]
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
      return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
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
      return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
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
      return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
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
      return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
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
      return res.status(200).json({ success: true, estabelecimentos: estabelecimentos })
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
