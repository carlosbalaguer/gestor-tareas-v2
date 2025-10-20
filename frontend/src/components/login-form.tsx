"use client"

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getAuthToken, login, setAuthToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [isRegistering, setIsRegistering] = useState(false);

	useEffect(() => {
		const token = getAuthToken();
		if (token) {
			router.push("/dashboard");
		}
	}, [router]);

	const loginUser = async () => {
		setIsRegistering(true);

		try {
			const response = await login(email, password);
			if (response.data.token) {
				setAuthToken(response.data.token);
				router.push("/dashboard");
			}
		} catch (error) {
			alert("Email o contraseña incorrectos");
		}
		setIsRegistering(false);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Iniciar sesión en tu cuenta</CardTitle>
					<CardDescription>
						Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@ejemplo.com"
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</Field>
							<Field>
								<div className="flex items-center">
									<FieldLabel htmlFor="password">
										Contraseña
									</FieldLabel>
								</div>
								<Input
									id="password"
									type="password"
									onChange={(e) =>
										setPassword(e.target.value)
									}
									required
								/>
							</Field>
							<Field>
								<Button
									onClick={loginUser}
									disabled={
										isRegistering || !email || !password
									}
								>
									Iniciar sesión
								</Button>
								<FieldDescription className="text-center">
									No tienes una cuenta?{" "}
									<Link href="/register">Regístrate</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
