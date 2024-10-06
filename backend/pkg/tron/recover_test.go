package tron_test

import (
	"fmt"
	"log"
	"math/big"
	"testing"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/fbsobreira/gotron-sdk/pkg/address"
)

type MockCredential struct {
	UID            string `json:"uid"`
	Signature      string `json:"signature"`
	Issuer         string `json:"issuer"`
	Recipient      string `json:"recipient"`
	ExpirationTime uint64 `json:"expiration_time"`
	Revocable      bool   `json:"revocable"`
	SchemaUID      string `json:"schema_uid"`
	RefUID         string `json:"ref_uid"`
	Data           string `json:"data"`
}

var mockCredential = MockCredential{
	UID:            "0xb09dd0d23321a037b6dabfbff549edae06186eec79b3201ff97ad10c24933cd7",
	Signature:      "0xa63030b5e4a65f452c8a62315060005f05fc096099ec6ff95d17cd2c0b04630c70f8225417736488ba59b7bf9c963d0bb7068f7573a3aec4ebe30a05e7f92cd41c",
	Issuer:         "0x0a33b0c9a5a9511c1603651735fb482054da2625",
	Recipient:      "0x0a33b0c9a5a9511c1603651735fb482054da2625",
	ExpirationTime: 0,
	Revocable:      false,
	SchemaUID:      "0x32b3f7acf4a2f5043985ba10a471ad76fa55e3b13b306ee4a3b3bbb609352571",
	RefUID:         "0x0000000000000000000000000000000000000000000000000000000000000000",
	Data:           "0x0000000000000000000000000000000000000000000000000000000000000000",
}

const TronContractAddress = "TZH4RxFLvYLFWg81GPCNzgYN6CoNJ6T5x8"

func TestTronBase58ToHex(t *testing.T) {
	validAddress, err := address.Base58ToAddress(TronContractAddress)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	fmt.Println("Hex Address:", validAddress.Hex())
}

func createDomainSeparator() []byte {
	// Domain Separator: Keccak256(EIP712Domain(name, version, chainId, verifyingContract))
	domainHash := crypto.Keccak256Hash(
		[]byte("SunID"),             // Name
		[]byte("1"),                 // Version
		[]byte("0x94a9059e"),        // ChainId
		[]byte(TronContractAddress), // VerifyingContract
	)

	return domainHash.Bytes()
}

// Hash the message according to EIP-712 Typed Data rules
func hashMessage() []byte {
	dataHash := crypto.Keccak256Hash(
		common.Hex2Bytes(mockCredential.UID[2:]),
		common.Hex2Bytes(mockCredential.Recipient[2:]),
		common.BigToHash(big.NewInt(int64(mockCredential.ExpirationTime))).Bytes(),
		[]byte{0}, // For revocable == false, we use 0 byte
		common.Hex2Bytes(mockCredential.RefUID[2:]),
		common.Hex2Bytes(mockCredential.Data[2:]),
	)
	return dataHash.Bytes()
}

func TestRecover(t *testing.T) {
	domainHash := createDomainSeparator()
	messageHash := hashMessage()

	completeHash := crypto.Keccak256Hash(
		domainHash,
		messageHash,
	)

	sig, err := hexutil.Decode(mockCredential.Signature)
	if err != nil {
		log.Fatalf("Failed to decode signature: %v", err)
	}

	// r := new(big.Int).SetBytes(sig[:32])
	// s := new(big.Int).SetBytes(sig[32:64])
	// v := uint8(sig[64]) + 27 // Adjust v for Ethereum/Tron signatures (v starts from 27)

	// Step 3: Recover the public key from the signature
	pubKey, err := crypto.SigToPub(completeHash.Bytes(), sig)
	if err != nil {
		log.Fatalf("Failed to recover public key: %v", err)
	}

	// Step 4: Derive the Ethereum/Tron address from the public key
	recoveredAddress := crypto.PubkeyToAddress(*pubKey)

	// Step 5: Compare the recovered address with the expected issuer address
	if recoveredAddress.Hex() == mockCredential.Issuer {
		fmt.Println("Signature is valid.")
	} else {
		fmt.Println("recoverAdderss: ", recoveredAddress.Hex())
		fmt.Println("Signature is invalid.")
	}
}
