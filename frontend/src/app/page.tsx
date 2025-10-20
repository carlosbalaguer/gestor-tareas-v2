"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function Home() {
	return (
		<>
			<Navbar />

			<main className="overflow-hidden">
				<section>
					<div className="relative pt-24 md:pt-36">
						<div className="mx-auto max-w-7xl px-6">
							<div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
								<h1 className="mt-8 max-w-4xl mx-auto text-balance text-6xl font-bold md:text-7xl lg:mt-16 xl:text-[5.25rem]">
									Planifica y organiza tus tareas facilmente
									con Kanban App
								</h1>

								<p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
									Organiza tus proyectos y tareas de manera
									eficiente con nuestra aplicación Kanban
									intuitiva y fácil de usar.
								</p>
							</div>
						</div>

						<div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
							<div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
								<img
									className="relative rounded-2xl"
									src={"kanban-dashboard.png"}
									alt={`dashboard`}
									width="2700"
									height="1440"
                  draggable="false"
								/>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
