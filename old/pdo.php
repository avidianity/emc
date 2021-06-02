<?php

use Libraries\Application;

return Application::try(function () {
	return database()->get();
});
