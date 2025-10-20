import Link from "next/link";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer>
			<div className="container mx-auto py-16 md:py-24 max-w-6xl">
				<div className="flex w-full flex-col justify-center gap-10">
					<div className="flex w-full flex-col gap-6">
						<Link href="/" className="flex items-center gap-2">
							<span className="text-xl font-semibold mx-auto">
								Kanban App
							</span>
						</Link>

						<p className="text-sm text-muted-foreground text-center">
							Organiza tus proyectos y tareas de manera
                            eficiente con nuestra aplicación Kanban intuitiva y
                            fácil de usar.
						</p>
					</div>
				</div>

				<div className="mt-8 flex w-full text-sm text-muted-foreground">
					<p className="mx-auto">
						© {currentYear} Kanban App. Todos los derechos
						reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
