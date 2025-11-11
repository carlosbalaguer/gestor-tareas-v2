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
import { getAuthToken, login, setAuthToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { ApiError } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const [isLoggingIn, setIsLoggingIn] = useState(false);
	const [serverError, setServerError] = useState<string>("");

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
	});

	useEffect(() => {
		const token = getAuthToken();
		if (token) {
			router.push("/dashboard");
		}
	}, [router]);

	const onSubmit = async (data: LoginFormData) => {
		setIsLoggingIn(true);
		setServerError("");

		try {
			const response = await login(data.email, data.password);
			if (response.data.token) {
				setAuthToken(response.data.token);
				router.push("/dashboard");
			}
		} catch (error) {
			const apiError = error as ApiError;

			let errorMessage = "Ha ocurrido un error. Intenta de nuevo.";

			if (apiError.response?.data?.errors) {
				errorMessage = apiError.response.data.errors
					.map((e) => e.message)
					.join(", ");
			}

			setServerError(errorMessage);
		} finally {
			setIsLoggingIn(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Iniciar sesión en tu cuenta</CardTitle>
					<CardDescription>
						Ingresa tu correo electrónico a continuación para
						iniciar sesión en tu cuenta
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Email</FieldLabel>
								<Input
									id="email"
									type="email"
									placeholder="m@ejemplo.com"
									{...formRegister("email")}
									aria-invalid={!!errors.email}
								/>
								{errors.email && (
									<p className="text-sm text-red-500 mt-1">
										{errors.email.message}
									</p>
								)}
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
									{...formRegister("password")}
									aria-invalid={!!errors.password}
								/>
								{errors.password && (
									<p className="text-sm text-red-500 mt-1">
										{errors.password.message}
									</p>
								)}
							</Field>

							{serverError && (
								<div className="text-sm text-red-500 text-center">
									{serverError}
								</div>
							)}

							<Field>
								<Button
									type="submit"
									disabled={isLoggingIn || !isValid}
								>
									{isLoggingIn
										? "Iniciando sesión..."
										: "Iniciar sesión"}
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
