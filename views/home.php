<?php extend('layouts.landing.header') ?>

<div class="navbar navbar-fixed-top custom-navbar" role="navigation">
	<div class="container">
		<div class="navbar-header">
			<button class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
				<span class="icon icon-bar"></span>
				<span class="icon icon-bar"></span>
				<span class="icon icon-bar"></span>
			</button>
			<a href="<?= url('/') ?>" class="navbar-brand">EMC</a>
		</div>
		<div class="collapse navbar-collapse">
			<ul class="nav navbar-nav navbar-right">
				<li>
					<a href="<?= url('login') ?>" class="smoothScroll">Log in</a>
				</li>
			</ul>
		</div>
	</div>
</div>
<section id="intro" class="parallax-section" style="background: url('<?= asset('assets/images/landing.jpg') ?>') 50% 0 repeat-y fixed ">
	<div class="container">
		<div class="row">

			<div class="col-md-12 col-sm-12">
				<h3 class="wow bounceIn animated" data-wow-delay="0.9s" style="visibility: visible; animation-delay: 0.9s; animation-name: bounceIn;">Welcome to</h3>
				<h1 class="wow fadeInUp animated" data-wow-delay="1.6s" style="visibility: visible; animation-delay: 1.6s; animation-name: fadeInUp;">EMC Registration System</h1>
				<a href="<?= url('login') ?>" class="btn btn-lg btn-danger smoothScroll wow fadeInUp animated" data-wow-delay="2.3s" style="visibility: visible; animation-delay: 2.3s; animation-name: fadeInUp;">Log In</a>
			</div>
		</div>
	</div>
</section>
<?php extend('layouts.footer') ?>