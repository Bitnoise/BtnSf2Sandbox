<?php

namespace Btn\ControlBundle\Controller;

use Btn\BaseBundle\Controller\BaseController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;

/**
 * Movie controller.
 *
 * @Route("/control")
 */
class DefaultController extends BaseController
{
    /**
     * @Route("/", name="control_index")
     * @Template()
     */
    public function indexAction()
    {

        return array();
    }
}
