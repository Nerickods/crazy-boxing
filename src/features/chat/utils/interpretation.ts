/**
 * Neural Interpretation Engine - KIA Intelligence
 * Transforms technical tool calls into human-readable strategic thoughts.
 */

export interface ToolInterpretation {
    thought: string;
    description: string;
}

const TOOL_MAPPINGS: Record<string, (args: any) => ToolInterpretation> = {
    register_lead: (args) => ({
        thought: `La IA ha detectado un prospecto de alto potencial: **${args.name}** de **${args.company}**.`,
        description: `Se está procediendo a asegurar la entrada de este lead en el ecosistema. Nivel de interés: Alto. Equipo: ${args.employee_size || 'No especificado'}.`
    }),
    // Add more tools here as the system scales
};

/**
 * Gets a human-readable interpretation of an AI tool decision.
 */
export function getHumanInterpretation(toolName: string, args: any): ToolInterpretation {
    const interpreter = TOOL_MAPPINGS[toolName];
    
    if (interpreter) {
        return interpreter(args);
    }

    return {
        thought: `La IA decidió ejecutar la acción: ${toolName}`,
        description: "Analizando parámetros técnicos..."
    };
}
