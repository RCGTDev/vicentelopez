import 'lib/boot/routes'
import router from 'lib/site/boot/router'
import AcercaDe from './pages/acerca-de'
import Datos from './pages/datos'
import TyC from './pages/terminos-y-condiciones'

router.childRoutes.unshift({
  path: 's/acerca-de',
  component: AcercaDe
})

router.childRoutes.unshift({
  path: 's/datos',
  component: Datos
})

router.childRoutes.unshift({
  path: 's/terminos-y-condiciones',
  component: TyC
})
