import { type CredShieldProviders } from "@CredShield-ntwrk/CredShield-js-types";
import { type FoundContract } from "@CredShield-ntwrk/CredShield-js-contracts";
import type {
  CredentialState,
  CredShieldPrivateState,
  Contract,
  Witnesses,
} from "@CredShield-ntwrk/credshield-contract";

export const credShieldPrivateStateKey = "credShieldPrivateState";
export type PrivateStateId = typeof credShieldPrivateStateKey;

export type PrivateStates = {
  readonly credShieldPrivateState: CredShieldPrivateState;
};

export type CredShieldContract = Contract<
  CredShieldPrivateState,
  Witnesses<CredShieldPrivateState>
>;

export type CredShieldCircuitKeys = Exclude<
  keyof CredShieldContract["impureCircuits"],
  number | symbol
>;

export type CredShieldProviders = CredShieldProviders<
  CredShieldCircuitKeys,
  PrivateStateId,
  CredShieldPrivateState
>;

export type DeployedCredShieldContract = FoundContract<CredShieldContract>;

export type CredShieldDerivedState = {
  readonly credentialState: CredentialState;
  readonly credentialId: string;
  readonly credentialMetadata: string | undefined;
  readonly issuerAuthority: string;
  readonly totalIssued: bigint;
  readonly totalVerified: bigint;
  readonly sequence: bigint;
  readonly isIssuer: boolean;
};
