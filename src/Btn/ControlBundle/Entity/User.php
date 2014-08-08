<?php

namespace Btn\ControlBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Btn\AdminBundle\Model\AbstractUser;

/**
 * @ORM\Entity(repositoryClass="Btn\ControlBundle\Repository\UserRepository")
 * @ORM\Table(name="btn_user")
 */
class User extends AbstractUser
{
}
