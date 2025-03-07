export default function TypPage() {
    return(
        <div className="container my-5">

			<div className="row mb-5">

				<div className="col-lg-6 offset-lg-3">
					<div className="border p-3 rounded mb-4 center">
						<center>
							<img src="images/icono-check.png" className="img-fluid mb-4" />
						</center>
						<p className="lead text-center mb-4">
							<strong>Tu cita ha sido agendada,</strong><br />
							 ¡Te esperamos pronto!
						</p>
						
					</div>

				</div>
			</div>

			<div className="row align-items-center">
				<div className="col-lg-5 offset-lg-1">
					<div className="titulos mb-5 text-left lh-1">Centro de Atención <strong className="verde-rent">Rent</strong></div>
					<p>
						Horarios de atención:<br/><br/>
						Lunes a Viernes: 9:00h - 18:00h<br/>
						Sábados: 09:00h - 13:00h<br/>
					</p>
				</div>
				<div className="col-lg-5">
					<center>
						<img src="images/sucursal.jpg" className="img-fluid" />
					</center>
				</div>
				<div className="col-lg-12 mt-5">
					<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d369.13107042474815!2d-99.17832761509018!3d19.3761149082034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff394d8aad57%3A0xda0645728c268402!2sAutofin%20Rent!5e0!3m2!1ses-419!2smx!4v1740421536478!5m2!1ses-419!2smx" width="600" height="450" style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-100"></iframe>
				</div>
			</div>
			
		</div>
    )
}