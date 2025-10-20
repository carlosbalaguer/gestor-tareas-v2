"use client";

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
import { getAuthToken, register, setAuthToken } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
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

	const registerUser = async () => {
		setIsRegistering(true);

		try {
			const response = await register(email, password);
			if (response.data.token) {
				setAuthToken(response.data.token);
				router.push("/dashboard");
			}
		} catch (error) {}
		setIsRegistering(false);
	};

	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>Crear una cuenta</CardTitle>
				<CardDescription>
					Ingresa tu información a continuación para crear tu cuenta
				</CardDescription>
			</CardHeader>
			<CardContent>
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
						<FieldLabel htmlFor="password">Contraseña</FieldLabel>
						<Input
							id="password"
							type="password"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Field>
					<FieldGroup>
						<Field>
							<Button
								onClick={registerUser}
								disabled={isRegistering || !email || !password}
							>
								Crear cuenta
							</Button>
							<FieldDescription className="px-6 text-center">
								Ya tienes una cuenta?{" "}
								<Link href="/login">Iniciar sesión</Link>
							</FieldDescription>
						</Field>
					</FieldGroup>
				</FieldGroup>
			</CardContent>
		</Card>
	);
}
