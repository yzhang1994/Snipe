

import com.hedera.account.AccountCreate;
import com.hedera.account.AccountGetInfo;
import com.hedera.account.DemoAccount;
import com.hedera.sdk.common.*;
import io.javalin.Javalin;
import com.hedera.sdk.account.HederaAccount;
import com.hedera.sdk.account.HederaAccountUpdateValues;
import com.hedera.sdk.account.HederaClaim;
import com.hedera.sdk.common.HederaKey.KeyType;
import com.hedera.sdk.cryptography.HederaCryptoKeyPair;
import com.hedera.utilities.ExampleUtilities;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.googlecode.protobuf.format.JsonFormat;

import java.util.*;

public class Main {
    public static void main(String[] args) {
        final Logger logger = LoggerFactory.getLogger(DemoAccount.class);
        Javalin app = Javalin.create().start(getHerokuAssignedPort());
        app.get("/account/balance/:shard_num/:realm_num/:account_num", ctx -> {
            HederaAccount account = new HederaAccount(
                    Long.parseLong(ctx.pathParam("shard_num")),
                    Long.parseLong(ctx.pathParam("realm_num")),
                    Long.parseLong(ctx.pathParam("account_num"))
            );
            Thread.sleep(1000);
            Long balance = account.getBalance();
            Thread.sleep(1000);
            ctx.result(Long.toString(-1));

        });
        app.post("/account", ctx -> {

            // setup a set of defaults for query and transactions
            HederaTransactionAndQueryDefaults txQueryDefaults = new HederaTransactionAndQueryDefaults();
            txQueryDefaults = ExampleUtilities.getTxQueryDefaults();

            // new account objects
            HederaAccount main_account = new HederaAccount();

            main_account.txQueryDefaults = txQueryDefaults;
            main_account.txQueryDefaults.generateRecord = true;
            HederaCryptoKeyPair newAccountKey = new HederaCryptoKeyPair(KeyType.ED25519);
            HederaCryptoKeyPair accountXferToKey = new HederaCryptoKeyPair(KeyType.ED25519);

            HederaAccount new_account = AccountCreate.create(main_account, newAccountKey,10000);
            Thread.sleep(1500);
            HederaAccountID account_id = new_account.getHederaAccountID();
            HashMap res = new HashMap();
            ctx.header("Access-Control-Allow-Headers","Access-Control-Allow-Origin, X-Requested-With, Content-Type, Accept");
            ctx.header("Access-Control-Allow-Origin","*");
            res.put("account_id", new_account.accountNum);
            res.put("public_key", newAccountKey.getPublicKey());
            res.put("private_key", newAccountKey.getSecretKey());
            HederaTransactionReceipt receipt = Utilities.getReceipt(
                    main_account.hederaTransactionID,
                    main_account.txQueryDefaults.node);
            Thread.sleep(1500);
            res.put("receipt", JsonFormat.printToString(receipt.getProtobuf()));
            ctx.json(res);

        });
    }


    private static int getHerokuAssignedPort() {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get("PORT") != null) {
            return Integer.parseInt(processBuilder.environment().get("PORT"));
        }
        return 7000;
    }

}
