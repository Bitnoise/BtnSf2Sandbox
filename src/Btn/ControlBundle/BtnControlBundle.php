<?php

namespace Btn\ControlBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class BtnControlBundle extends Bundle
{
    public function getParent()
    {
        return 'BtnAdminBundle';
    }
}
